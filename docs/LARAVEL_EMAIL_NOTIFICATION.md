# Laravel Email Notification untuk PO Approval

Dokumentasi ini menjelaskan cara mengimplementasikan email notification di backend Laravel untuk sistem approval Purchase Order.

## 1. Buat Notification Class

```bash
php artisan make:notification PurchaseOrderPendingApproval
```

**File: `app/Notifications/PurchaseOrderPendingApproval.php`**

```php
<?php

namespace App\Notifications;

use App\Models\PurchaseOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PurchaseOrderPendingApproval extends Notification implements ShouldQueue
{
    use Queueable;

    protected PurchaseOrder $purchaseOrder;

    public function __construct(PurchaseOrder $purchaseOrder)
    {
        $this->purchaseOrder = $purchaseOrder;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $po = $this->purchaseOrder;
        
        return (new MailMessage)
            ->subject('PO Menunggu Persetujuan: ' . $po->po_number)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Ada Purchase Order baru yang membutuhkan persetujuan Anda.')
            ->line('')
            ->line('**Detail PO:**')
            ->line('- No. PO: ' . $po->po_number)
            ->line('- Supplier: ' . $po->supplier->name)
            ->line('- Total: Rp ' . number_format($po->total_amount, 0, ',', '.'))
            ->line('- Tanggal Order: ' . $po->order_date->format('d M Y'))
            ->line('- Dibuat oleh: ' . $po->creator->name)
            ->action('Lihat Detail PO', url('/pharmacy/purchase-orders'))
            ->line('Silakan login untuk menyetujui atau menolak PO ini.')
            ->salutation('Terima kasih,<br>Sistem Klinik');
    }

    public function toArray($notifiable): array
    {
        $po = $this->purchaseOrder;
        
        return [
            'type' => 'po_pending_approval',
            'title' => 'PO Menunggu Persetujuan',
            'message' => "PO {$po->po_number} dari {$po->supplier->name} menunggu persetujuan",
            'po_id' => $po->id,
            'po_number' => $po->po_number,
            'supplier_name' => $po->supplier->name,
            'total_amount' => $po->total_amount,
            'created_by' => $po->creator->name,
        ];
    }
}
```

## 2. Buat Notification untuk PO Approved/Rejected

**File: `app/Notifications/PurchaseOrderApproved.php`**

```php
<?php

namespace App\Notifications;

use App\Models\PurchaseOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PurchaseOrderApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected PurchaseOrder $purchaseOrder;

    public function __construct(PurchaseOrder $purchaseOrder)
    {
        $this->purchaseOrder = $purchaseOrder;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $po = $this->purchaseOrder;
        
        return (new MailMessage)
            ->subject('PO Disetujui: ' . $po->po_number)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Purchase Order Anda telah disetujui.')
            ->line('')
            ->line('**Detail PO:**')
            ->line('- No. PO: ' . $po->po_number)
            ->line('- Supplier: ' . $po->supplier->name)
            ->line('- Total: Rp ' . number_format($po->total_amount, 0, ',', '.'))
            ->line('- Disetujui oleh: ' . $po->approver->name)
            ->line('- Tanggal Approval: ' . $po->approved_at->format('d M Y H:i'))
            ->when($po->approval_notes, function ($message) use ($po) {
                return $message->line('- Catatan: ' . $po->approval_notes);
            })
            ->action('Lihat Detail PO', url('/pharmacy/purchase-orders'))
            ->line('Silakan lanjutkan proses pemesanan ke supplier.')
            ->salutation('Terima kasih,<br>Sistem Klinik');
    }

    public function toArray($notifiable): array
    {
        $po = $this->purchaseOrder;
        
        return [
            'type' => 'po_approved',
            'title' => 'PO Disetujui',
            'message' => "PO {$po->po_number} telah disetujui oleh {$po->approver->name}",
            'po_id' => $po->id,
            'po_number' => $po->po_number,
            'approved_by' => $po->approver->name,
        ];
    }
}
```

**File: `app/Notifications/PurchaseOrderRejected.php`**

```php
<?php

namespace App\Notifications;

use App\Models\PurchaseOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PurchaseOrderRejected extends Notification implements ShouldQueue
{
    use Queueable;

    protected PurchaseOrder $purchaseOrder;

    public function __construct(PurchaseOrder $purchaseOrder)
    {
        $this->purchaseOrder = $purchaseOrder;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $po = $this->purchaseOrder;
        
        return (new MailMessage)
            ->subject('PO Ditolak: ' . $po->po_number)
            ->error()
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Purchase Order Anda telah ditolak.')
            ->line('')
            ->line('**Detail PO:**')
            ->line('- No. PO: ' . $po->po_number)
            ->line('- Supplier: ' . $po->supplier->name)
            ->line('- Total: Rp ' . number_format($po->total_amount, 0, ',', '.'))
            ->line('- Ditolak oleh: ' . $po->rejector->name)
            ->line('- Alasan: ' . $po->rejection_reason)
            ->action('Lihat Detail PO', url('/pharmacy/purchase-orders'))
            ->line('Silakan perbaiki PO dan ajukan kembali.')
            ->salutation('Terima kasih,<br>Sistem Klinik');
    }

    public function toArray($notifiable): array
    {
        $po = $this->purchaseOrder;
        
        return [
            'type' => 'po_rejected',
            'title' => 'PO Ditolak',
            'message' => "PO {$po->po_number} ditolak: {$po->rejection_reason}",
            'po_id' => $po->id,
            'po_number' => $po->po_number,
            'rejection_reason' => $po->rejection_reason,
            'rejected_by' => $po->rejector->name,
        ];
    }
}
```

## 3. Update PurchaseOrderController

**File: `app/Http/Controllers/Api/PurchaseOrderController.php`**

Tambahkan di method `submitForApproval`:

```php
use App\Models\User;
use App\Notifications\PurchaseOrderPendingApproval;
use App\Notifications\PurchaseOrderApproved;
use App\Notifications\PurchaseOrderRejected;

// Di method submitForApproval
public function submitForApproval(PurchaseOrder $purchaseOrder)
{
    // ... existing code ...
    
    $purchaseOrder->update(['status' => 'pending_approval']);
    
    // Kirim notifikasi ke semua admin
    $admins = User::whereIn('role', ['super_admin', 'admin_klinik'])->get();
    foreach ($admins as $admin) {
        $admin->notify(new PurchaseOrderPendingApproval($purchaseOrder));
    }
    
    return response()->json([
        'message' => 'PO berhasil diajukan untuk persetujuan',
        'data' => $purchaseOrder->fresh()
    ]);
}

// Di method approve
public function approve(Request $request, PurchaseOrder $purchaseOrder)
{
    // ... existing code ...
    
    $purchaseOrder->update([
        'status' => 'approved',
        'approved_by' => auth()->id(),
        'approved_at' => now(),
        'approval_notes' => $request->notes,
    ]);
    
    // Kirim notifikasi ke pembuat PO
    $purchaseOrder->creator->notify(new PurchaseOrderApproved($purchaseOrder->fresh()));
    
    return response()->json([
        'message' => 'PO berhasil disetujui',
        'data' => $purchaseOrder->fresh()
    ]);
}

// Di method reject
public function reject(Request $request, PurchaseOrder $purchaseOrder)
{
    // ... existing code ...
    
    $purchaseOrder->update([
        'status' => 'rejected',
        'rejected_by' => auth()->id(),
        'rejected_at' => now(),
        'rejection_reason' => $request->reason,
    ]);
    
    // Kirim notifikasi ke pembuat PO
    $purchaseOrder->creator->notify(new PurchaseOrderRejected($purchaseOrder->fresh()));
    
    return response()->json([
        'message' => 'PO berhasil ditolak',
        'data' => $purchaseOrder->fresh()
    ]);
}
```

## 4. Setup Database Notifications (Optional)

Jika ingin menyimpan notifikasi di database:

```bash
php artisan notifications:table
php artisan migrate
```

Tambahkan trait di User model:

```php
// app/Models/User.php
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;
    // ...
}
```

## 5. API Endpoint untuk Notifikasi

**File: `routes/api.php`**

```php
Route::middleware('auth:sanctum')->group(function () {
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
});
```

**File: `app/Http/Controllers/Api/NotificationController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->take(50)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->data['type'] ?? 'general',
                    'title' => $notification->data['title'] ?? '',
                    'message' => $notification->data['message'] ?? '',
                    'data' => $notification->data,
                    'read' => !is_null($notification->read_at),
                    'created_at' => $notification->created_at->toISOString(),
                ];
            });

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['message' => 'Notifikasi telah dibaca']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Semua notifikasi telah dibaca']);
    }

    public function unreadCount(Request $request)
    {
        return response()->json([
            'count' => $request->user()->unreadNotifications()->count()
        ]);
    }
}
```

## 6. Konfigurasi Email

**File: `.env`**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@klinik.com
MAIL_FROM_NAME="${APP_NAME}"
```

## 7. Queue Worker (Recommended)

Untuk mengirim email secara async:

```bash
php artisan queue:work
```

Atau gunakan supervisor di production.

## 8. Testing

```bash
# Test kirim email
php artisan tinker
>>> $user = User::find(1);
>>> $po = PurchaseOrder::find(1);
>>> $user->notify(new App\Notifications\PurchaseOrderPendingApproval($po));
```

---

## Ringkasan Alur:

1. **Staff Apotek** membuat PO dan submit untuk approval
2. **Sistem** mengirim email + database notification ke semua Admin
3. **Admin** melihat notifikasi di dashboard (icon lonceng)
4. **Admin** approve/reject PO
5. **Sistem** mengirim email + notification ke pembuat PO

Dengan implementasi ini, sistem notifikasi akan berjalan lengkap dengan:
- Email notification
- Database notification (in-app)
- Sound notification (frontend)
- Browser push notification (frontend)
